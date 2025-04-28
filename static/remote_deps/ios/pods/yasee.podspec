#
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html.
# Run `pod lib lint yasee.podspec` to validate before publishing.
#
Pod::Spec.new do |s|
  s.name             = 'yasee'
  s.version          = '0.9.225'
  s.summary          = 'Yasee SDK (iOS)版本'
  s.description      = <<-DESC
Yasee SDK 是一个聚合蓝牙交互,多家外部方案商的聚合SDK
                       DESC
  s.homepage         = 'http://henrygao.hopto.org'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'Henry Gao' => 'yoyohenrygao@163.com' }
  s.source           = { :http => 'https://doc.yasee.com.cn/remote_deps/ios/pods/yasee.zip' }
#  s.source_files = 'Classes/**/*'
#  s.dependency 'Flutter'
  s.platform = :ios, '13.0'
#   s.static_framework=true

  # does not contain a i386 slice.
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES', 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'i386' }
  s.swift_version = '5.0'
  s.vendored_frameworks = ['frameworks/yasee_ios.framework', 'frameworks/*.xcframework']
end
