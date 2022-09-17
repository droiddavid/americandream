cls
cd src
cd app

call echo y | copy c:\xampp\htdocs\mpk\bylayouts\foodapp\src\app\app.component.html
call echo y | copy c:\xampp\htdocs\mpk\bylayouts\foodapp\src\app\app.component.ts

md auth
cd auth
call ng g c signin
call ng g c signup
cd..

md features
cd features


call ng g c dashboard
call ng g module dashboard
cd..

md components
cd components
call ng g c user
cd user
call echo y | copy c:\xampp\htdocs\mpk\bylayouts\foodapp\src\app\components\user\user.component.html
call echo y | copy c:\xampp\htdocs\mpk\bylayouts\foodapp\src\app\components\user\user.component.ts
cd..
cd..

md services
cd services
call ng g service global
call echo y | copy c:\xampp\htdocs\mpk\bylayouts\foodapp\src\app\services\global.service.ts
md subjects
cd subjects
call ng g service header
call echo y | copy c:\xampp\htdocs\mpk\bylayouts\foodapp\src\app\services\subjects\header.service.ts
cd..

md database
cd database
call ng g service database
call echo y | copy c:\xampp\htdocs\mpk\bylayouts\foodapp\src\app\services\database\database.service.ts
cd..
cd..

md structure
cd structure
call ng g c home

call ng g c header
cd header
call echo y | copy c:\xampp\htdocs\mpk\bylayouts\foodapp\src\app\structure\header\header.component.html
call echo y | copy c:\xampp\htdocs\mpk\bylayouts\foodapp\src\app\structure\header\header.component.ts
cd..

call ng g c footer
cd footer
call echo y | copy c:\xampp\htdocs\mpk\bylayouts\foodapp\src\app\structure\footer\footer.component.html
call echo y | copy c:\xampp\htdocs\mpk\bylayouts\foodapp\src\app\structure\footer\footer.component.ts
cd..
cd..

md types
cd types
call ng g class menuitem
call echo y | copy c:\xampp\htdocs\mpk\bylayouts\foodapp\src\app\types\menuitem.ts
cd..
cd..

md stylesheets
cd stylesheets
call echo y | copy c:\xampp\htdocs\mpk\bylayouts\foodapp\src\stylesheets\*.css

cd..
cd..