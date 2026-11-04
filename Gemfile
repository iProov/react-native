source 'https://rubygems.org'
# You may use http://rbenv.org/ or https://rvm.io/ to install and use this version
ruby ">= 3.2.0"
gem 'cocoapods', '~> 1.16'
gem 'activesupport', '>= 7.0', '< 8.0'
# activesupport passes quirks_mode: to JSON.parse and JSON.generate
# (active_support/json/{decoding,encoding}.rb). json removed the option in 2.0.0
# but ignored it until 3.0 began raising ArgumentError on unknown keywords,
# which surfaces as "Invalid `Podfile` file: unknown keyword: quirks_mode".
# The ~> cap is what keeps us off 3.x; 2.19.9 carries the fix for the format
# string injection advisory.
gem 'json', '~> 2.19', '>= 2.19.9'
gem 'nkf' # Required on Ruby >= 3.4 where kconv was extracted from stdlib
