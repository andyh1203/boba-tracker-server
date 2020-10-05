output "droplet_public_ipv4" {
  value = digitalocean_droplet.api.ipv4_address
}