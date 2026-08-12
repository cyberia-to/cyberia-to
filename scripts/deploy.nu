# Deploy the cyberia.to landing → cyberproxy:/var/www/html/cyberia.to/
#
#   nu scripts/deploy.nu

def main [] {
  let root = (
    if ($"($env.PWD)/index.html" | path exists) { $env.PWD }
    else { error make {msg: "run from cyberia-to root"} }
  )
  print "→ rsync → cyberproxy:/var/www/html/cyberia.to/"
  ^ssh cyberproxy "mkdir -p /var/www/html/cyberia.to"
  ^rsync -az --delete --exclude ".git" --exclude "scripts" $"($root)/" "cyberproxy:/var/www/html/cyberia.to/"
  print "✓ deployed → https://cyberia.to/"
}
