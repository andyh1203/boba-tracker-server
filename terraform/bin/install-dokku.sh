#!/usr/bin/env bash
#
# id: bash_install_dokku
# description: Install Dokku using Debian package in an idempotent way
#
# Resources
# - Dokku Debian Package Installation Notes
#   https://github.com/dokku/dokku/blob/master/docs/getting-started/install/debian.md
#

set -e

self=${0##*/}
log() {
  echo "== $self $1"
}

DOKKU_VERSION="$1"
DOKKU_HOSTNAME="$2"
DOKKU_LETSENCRYPT_EMAIL="$3"
DROPLET_NAME="$4"
DOMAIN_NAME="$5"
log "DOKKU_VERSION=$DOKKU_VERSION"
log "DOKKU_HOSTNAME=$DOKKU_HOSTNAME"
log "DOKKU_LETSENCRYPT_EMAIL=$DOKKU_LETSENCRYPT_EMAIL"
log "DROPLET_NAME=$DROPLET_NAME"
log "DOMAIN_NAME=$DOMAIN_NAME"

log "Waiting 20 sec. for package managers"
sleep 20

log "Install prerequisites"
sudo apt-get update -qq >/dev/null
sudo apt-get install -qq -y apt-transport-https

log "Install docker"
wget -nv -O - https://get.docker.com/ | sh

log "Prepare dokku installation ..."
wget -nv -O - https://packagecloud.io/dokku/dokku/gpgkey | apt-key add -
OS_ID="$(lsb_release -cs 2>/dev/null || echo "trusty")"
echo "trusty utopic vivid wily xenial yakkety zesty artful bionic" | grep -q "$OS_ID" || OS_ID="trusty"
echo "deb https://packagecloud.io/dokku/dokku/ubuntu/ ${OS_ID} main" | sudo tee /etc/apt/sources.list.d/dokku.list
sudo apt-get update -qq >/dev/null

log "Setting options for unattended install ..."
echo "dokku dokku/vhost_enable boolean true" | sudo debconf-set-selections
echo "dokku dokku/web_config boolean false" | sudo debconf-set-selections
echo "dokku dokku/hostname string $DOKKU_HOSTNAME" | sudo debconf-set-selections
echo "dokku dokku/skip_key_file boolean false" | sudo debconf-set-selections
echo "dokku dokku/key_file string $HOME/.ssh/authorized_keys" | sudo debconf-set-selections
echo "dokku dokku/nginx_enable boolean true" | sudo debconf-set-selections

log "Install dokku"
sudo apt-get install -qq -y dokku=$DOKKU_VERSION
sudo dokku plugin:install-dependencies --core

log "Setting up dokku containers"
dokku apps:create api

log "Setting up mongo"
sudo dokku plugin:install https://github.com/dokku/dokku-mongo.git mongo
dokku mongo:create db
dokku mongo:link db api

log "Setting up redis"
sudo dokku plugin:install https://github.com/dokku/dokku-redis.git redis
dokku redis:create cache
dokku redis:link cache api

log "Setting up api"
docker pull andyhuynh/boba-tracker-server:latest
docker tag andyhuynh/boba-tracker-server:latest dokku/api:latest
dokku tags:deploy api

log "Setting up letsencrypt"
sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
dokku config:set --no-restart api DOKKU_LETSENCRYPT_EMAIL=$DOKKU_LETSENCRYPT_EMAIL

dokku domains:remove-global $DROPLET_NAME
dokku domains:add-global $DOMAIN_NAME

dokku domains:remove api api.$DROPLET_NAME
dokku domains:add api api.$DOMAIN_NAME

dokku proxy:ports-add api http:80:8080

# Add A record to namecheap, then run below
# dokku letsencrypt api