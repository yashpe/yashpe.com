html_template = File.read("index.html.template")


images =  Dir['medium-images/*.JPG'].map.with_index do |f, idx|
            %Q{<div #{'class="selected"' if idx == 0}><img src="#{f}" /></div>}
          end

# images_html = images.each_slice(images.size/5).map do |arr|
# 	%Q{<div class="big_box"><div class="images">#{arr.join("\n")}</div></div>}
# end.join("\n")
# images_html = images.map do |arr|
# 	%Q{<div class="big_box">#{arr.join("\n")}</div></div>}
# end.join("\n")


html_template.gsub!("HERE-COMES-IMAGES", images.join("\n"))

File.open('index.html' , 'w+') do |fi|
  fi.puts html_template
end