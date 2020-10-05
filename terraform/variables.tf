variable "do_token" {
  description = "Digital Ocean Personal Access Token"
  type        = string
}
variable "ssh_key_name" {
  description = "Digital Ocean SSH Key Name"
  type        = string
}

variable "ssh_private_key_path" {
  description = "SSH private key path"
  default     = "~/.ssh/id_rsa"
}

variable "ssh_user" {
  description = "SSH user"
  default     = "root"
}

variable "dokku_version" {
  description = "Dokku version"
  default     = "0.19.6"
}

variable "dokku_hostname" {
  description = "Dokku hostname"
  default     = "dokku.huynhandy.com"
}

variable "dokku_letsencrypt_email" {
  description = "Dokku letsecrypt email"
}

variable "domain" {
  description = "Your domain"
}