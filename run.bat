cls
del .\dist\harmony3ddemos.exe
go build -ldflags="-X main.ReleaseMode=false" -o dist/harmony3ddemos.exe ./src/server/
.\dist\harmony3ddemos.exe
