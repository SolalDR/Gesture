# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

activate :directory_indexes
data.contents.articles.each do |article|
  proxy "/timeline/#{article.slug}/index.html", '/article.html', locals: { article: article }, ignore: true, layout: 'layout'
end

activate :external_pipeline,
         name: :webpack,
         command: build? ? './node_modules/webpack/bin/webpack.js --bail' : './node_modules/webpack/bin/webpack.js --watch -d',
         # command: build? ?
         # "./node_modules/webpack/bin/webpack.js --bail -p" :
         # "./node_modules/webpack/bin/webpack.js --watch -d --progress --color",
         source: ".tmp/dist",
         latency: 1


# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

configure :build do
  activate :minify_css
  activate :relative_assets
end

helpers do
  def svg(name)
    root = Middleman::Application.root
    file_path = "#{root}/source/images/svg/#{name}.svg"
    File.exists?(file_path) ? File.read(file_path) : '(not found)'
  end
end
