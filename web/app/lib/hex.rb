module Hex
  class Colors
    #true for "light", false for "dark" colors
    def self.light?(hex_color)
      hex_color = hex_color.gsub('#','')
      if hex_color.length == 3
        hex_color = hex_color.split("").map{|c| c + c }.join
      end
      r = hex_color[0,2].to_s.to_i(16)
      g = hex_color[2,2].to_s.to_i(16)
      b = hex_color[4,2].to_s.to_i(16)
      yiq = ((r*299)+(g*587)+(b*114))/1000
      (yiq >= 128)
    end

    # Amount should be a decimal between 0 and 1. Lower means darker
    def self.darken(hex_color, amount=0.95)
      hex_color = hex_color.gsub('#','')
      if hex_color.length == 3
        hex_color = hex_color.split("").map{|c| c + c }.join
      end
      rgb = hex_color.scan(/../).map {|color| color.hex}
      rgb[0] = (rgb[0].to_i * amount).round
      rgb[1] = (rgb[1].to_i * amount).round
      rgb[2] = (rgb[2].to_i * amount).round
      "#%02x%02x%02x" % rgb
    end
      
    # Amount should be a decimal between 0 and 1. Higher means lighter
    def self.lighten(hex_color, amount=0.05)
      hex_color = hex_color.gsub('#','')
      if hex_color.length == 3
        hex_color = hex_color.split("").map{|c| c + c }.join
      end
      rgb = hex_color.scan(/../).map {|color| color.hex}
      rgb[0] = [(rgb[0].to_i + 255 * amount).round, 255].min
      rgb[1] = [(rgb[1].to_i + 255 * amount).round, 255].min
      rgb[2] = [(rgb[2].to_i + 255 * amount).round, 255].min
      "#%02x%02x%02x" % rgb
    end
  end
end