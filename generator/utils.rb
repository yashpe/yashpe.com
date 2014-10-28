require 'google_drive'
require 'json'

WEDDING_UTILS_FOLDER = Dir.pwd

def getf(fn)
  File.read(fn).gsub("\n",'')
end

def minimizing_assets!
  puts "minimizing assets"

  puts `cd #{PROJECT_FOLDER} && node #{WEDDING_UTILS_FOLDER + "/local/" + ASSETS_CRUNCHER}`
  puts "done"
  "<style>#{File.read(PROJECT_FOLDER + "/assets/base-min-yui.css")}</style>"
end

def get_docs(spn, username, password, optional = nil)
  force = (optional == "force")
  if !force && File.exists?("images_#{spn}.json")
    puts "getting data from local json"
    return JSON.load(File.read("images_#{spn}.json")) 
  end
  puts "SPREADSHEET: #{SPREADSHEET}"
  puts "spn: #{spn}"
  

  puts "reading data from google docs"
  session = GoogleDrive.login(username, password)
  ws = session.spreadsheet_by_key(SPREADSHEET).worksheets[spn]
  puts "."

  idx_ = 0
  print "data to hash"
  rows = ws.rows[1..-1]
  images =  rows.map.with_index do |row, idx|

    next if row[1].strip == ''
    next if row[0].strip != ''
    idx_+=1
    # next unless row[0].include?('object')

    hsh_ = ws.rows[0].each_with_object({}).with_index do |(e, hsh), idx|
      if row[idx].strip != ''
        if e.include?('[]')
          hsh.merge!({e.gsub('[]','') => row[idx].split(',').map(&:strip)})
        else
          hsh.merge!({e => row[idx]})
        end
      else
        hsh
      end
    end
    hsh_
  end


  File.write("images_#{spn}.json", images.to_json)
  puts "loaded #{images.size}"
  puts
  images
end


def image_htmls(images)
  puts "htmlizing images"
  locations = []

  images_htmls = images.compact.map.with_index do |image, idx|
    locations.push(image['location'])
    hsh = {}
    li_hsh = {}
    html = ""

    if idx == 0
      li_hsh['class'] = 'selected'
    end

    src = image['src'].to_s.gsub(DBF, PRODUCTION_ASSETS_FOLDER)

    if image['embed']
      html = image['embed']
      li_hsh['data-title'] = idx
    # elsif image['video']
    #   hsh['data-video-click-to-play'] = image['video_click_to_play'].to_s.strip.squeeze(' ')
    #   video = image['video'].to_s.strip.squeeze(' ').gsub(DBF, PRODUCTION_ASSETS_FOLDER)
    #   # html = %Q{<video height="100%" controls autoplay><source src="#{video}" type="video/mp4"><source src="' + video.replace('.mp4','.theora.ogv') + '" type="video/ogg"></video>}
    #   # hsh['autoplay'] = 'autoplay' unless hsh['data-video-click-to-play'] == 'TRUE'
    #   hsh['loop'] = 'loop' if hsh['autoplay']
    #   # hsh['preload']
    #   hsh['poster'] = src 
    #   hsh_ = hsh.map { |k,v| "#{k}='#{v}'" if v!='' }.compact.join(' ')
    #   html = %Q{<video #{hsh_} height="100%"><source src="#{video.gsub('.mp4','.webm')}" type="video/webm"><source src="#{video}" type="video/mp4"></video>}
    else

      
      hsh['class'] = 'photo'
      hsh['title'] = image['src'].split("/").last
      li_hsh['data-title'] = hsh['title']
      hsh['data-video-click-to-play'] = (image['video_click_to_play'].to_s.strip.squeeze(' ') == 'TRUE') ? 'TRUE' : ''
      hsh['data-video'] = image['video'].to_s.strip.squeeze(' ').gsub(DBF, PRODUCTION_ASSETS_FOLDER)

      # hsh['src'] = image['src']
      if idx < 3
        base64_file_name = image['src'].gsub(DBF, PROJECT_FOLDER).gsub("medium-images","medium-images-base64")
        hsh['src'] = "data:image/jpeg;charset=utf-8;base64,#{File.read(base64_file_name).gsub("\n","")}"
      else      
        li_hsh['class'] = 'preloaded'
        hsh['data-src'] = src
        base64_file_name = image['src'].gsub(DBF, PROJECT_FOLDER).gsub("medium-images","small-images-base64")
        hsh['src'] = "data:image/jpeg;charset=utf-8;base64,#{File.read(base64_file_name).gsub("\n","")}"
      end
      
      fb_html = ''

      if (fb = image['fb'].to_s.strip.squeeze(' ')) != ''
        fb_html = %Q{<a class="piner" href="#{fb}" target="_blank" title="Facebook"></a>}
      end
      
      hsh_ = hsh.map { |k,v| "#{k}='#{v}'" if v!='' }.compact.join(' ')
      html = "<img #{hsh_} />" + fb_html
    end
    li_hsh['data-location'] = image['location'].to_s.gsub(' ','_')
    li_hsh_ = li_hsh.map { |k,v| "#{k}='#{v}'" if v!='' }.compact.join(' ')
    li_hsh_ = li_hsh.empty? ? '' : " #{li_hsh_} "
    "<div#{li_hsh_}>#{html}<script>preload(#{idx},#{images.size - 1});</script></div>"
  end

  locations_htmls = locations.compact.uniq.map.with_index do |location, idx|
    "<li data-location='#{location.gsub(' ','_')}'>#{location.gsub(" ","&nbsp;")}</li>"
  end
    # // locations.find('.slidee').append('<li id="mplayer"><object width="150" height="120" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="gsPlaylist10097606292" name="gsPlaylist10097606292"><param name="movie" value="http://grooveshark.com/widget.swf" /><param name="wmode" value="window" /><param name="allowScriptAccess" value="always" /><param name="flashvars" value="hostname=grooveshark.com&playlistID=100976062&p=1&bbg=000000&bth=000000&pfg=000000&lfg=000000&bt=FFFFFF&pbg=FFFFFF&pfgh=FFFFFF&si=FFFFFF&lbg=FFFFFF&lfgh=FFFFFF&sb=FFFFFF&bfg=666666&pbgh=666666&lbgh=666666&sbh=666666" /><object type="application/x-shockwave-flash" data="http://grooveshark.com/widget.swf" width="150" height="120"><param name="wmode" value="window" /><param name="allowScriptAccess" value="always" /><param name="flashvars" value="hostname=grooveshark.com&playlistID=100976062&p=1&bbg=000000&bth=000000&pfg=000000&lfg=000000&bt=FFFFFF&pbg=FFFFFF&pfgh=FFFFFF&si=FFFFFF&lbg=FFFFFF&lfgh=FFFFFF&sb=FFFFFF&bfg=666666&pbgh=666666&lbgh=666666&sbh=666666" /></object></object></li>')

  # locations_htmls.push %Q{
  # <li id="mplayer">
  #   <audio controls loop src="data:audio/ogg;base64,#{File.read(PROJECT_FOLDER + "/assets/song8.ogg.base64").gsub("\n","")}" />
  # </li>
  # }
  locations_htmls.push %Q{
    <li>
      <a href="#{PRODUCTION_ASSETS_FOLDER}/mesiba">למסיבה</a>
    </li>
  }
  locations_htmls.push %Q{
  <li id="mplayer">
    <audio controls loop>
      <source src="#{PRODUCTION_ASSETS_FOLDER}/assets/song.ogg" type="audio/ogg">
      <source src="#{PRODUCTION_ASSETS_FOLDER}/assets/song.mp3" type="audio/mp3">
    </audio>
  </li>}
  puts 'done'
  puts
  return images_htmls.join("\n"), locations_htmls.join("\n")
end