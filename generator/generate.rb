#!/usr/bin/ruby 
require './utils.rb'
require 'erb'
require ARGV[2]

if ARGV[0].to_s == ''
  puts "no username"
  exit
end

if ARGV[1].to_s == ''
  puts "no password"
  exit
end

CSS = minimizing_assets!


images = get_docs(SHEET, ARGV[0], ARGV[1])

images_htmls, locations_htmls = image_htmls(images)

javascripts = JS
stylesheets = CSS

Dir.chdir(PROJECT_FOLDER)

template = File.read(TEMPLATE_FILE)

print "generating index.html... "

index_html = ERB.new(template).result

File.write(PRODUCTION_HTML, index_html)
  
puts "done"

javscripts = STATIC_JAVASCRIPTS
stylesheets = STATIC_STYLESHEETS

print "generating dev.html... "

index_html = ERB.new(template).result.gsub(PRODUCTION_ASSETS_FOLDER, LOCAL_FOLDER)

File.write(DEVELOPMENT_HTML, index_html)

puts "done"
