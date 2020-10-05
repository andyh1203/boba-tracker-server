resource "digitalocean_droplet" "api" {
  image              = "ubuntu-18-04-x64"
  name               = "dokku-s-1vcpu-1gb-sfo3-01"
  region             = "sfo3"
  size               = "s-1vcpu-1gb"
  private_networking = false
  ssh_keys = [
    data.digitalocean_ssh_key.default.fingerprint
  ]
}

resource "null_resource" "install_dokku" {

  triggers = {
    dokku_version  = md5(var.dokku_version)
    dokku_hostname = md5(var.dokku_hostname)
  }

  connection {
    type        = "ssh"
    user        = var.ssh_user
    host        = digitalocean_droplet.api.ipv4_address
    private_key = file(var.ssh_private_key_path)
  }

  provisioner "file" {
    source      = "${path.module}/bin/install-dokku.sh"
    destination = "/tmp/install-dokku.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/install-dokku.sh",
      "/tmp/install-dokku.sh ${var.dokku_version} ${var.dokku_hostname} ${var.dokku_letsencrypt_email} ${digitalocean_droplet.api.name} ${var.domain}"
    ]
  }
}



