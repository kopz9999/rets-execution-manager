# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.provision :shell, path: "provision/install-nvm.sh", privileged: false
  config.vm.provision :shell, path: "provision/install-node.sh", args: "7.0.0", privileged: false
  config.vm.provision :shell, path: "provision/install-avn.sh", privileged: false
  config.vm.provision :shell, path: "provision/install-aws-cli.sh", privileged: false
  config.vm.provider "virtualbox" do |v|
    v.memory = 1024
    v.cpus = 2
  end
  config.vm.provider "virtualbox" do |v|
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end
  config.vm.network :forwarded_port, guest: 3000, host: 3010
end
