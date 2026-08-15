# 来源：项目源代码/desktop/package.json 与 visitor-app/README.md
# Electron 桌面端（当前已执行并产出评审包）
Set-Location desktop
npm run dist:win
npm run dist:mac:x64
npm run dist:mac:arm64
npm run dist:linux

# uni-app x 游客端（摘自 visitor-app/README.md；<repo> 由构建者替换）
& 'D:\HBuilderX.5.15.2026070915\HBuilderX\cli.exe' launch web --project '<repo>\visitor-app' --compile true
& 'D:\HBuilderX.5.15.2026070915\HBuilderX\cli.exe' launch mp-weixin --project '<repo>\visitor-app' --compile true
& 'D:\HBuilderX.5.15.2026070915\HBuilderX\cli.exe' launch app-android --project '<repo>\visitor-app' --compile true
& 'D:\HBuilderX.5.15.2026070915\HBuilderX\cli.exe' launch app-ios --project '<repo>\visitor-app' --iosTarget simulator --compile true
& 'D:\HBuilderX.5.15.2026070915\HBuilderX\cli.exe' launch app-harmony --project '<repo>\visitor-app' --compile true
