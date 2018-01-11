# Drone Cafe

Дипломная работа "Node, Angular и MongoDB: разработка полноценных веб-приложений" "Нетологии".
<br />
Задание: [https://bitbucket.org/netology-university/drone-cafe](https://bitbucket.org/netology-university/drone-cafe).<br />
Страница [клиента](https://drone-cafe-app.herokuapp.com/#!/),
страница [повара](https://drone-cafe-app.herokuapp.com/#!/kitchen).

## Запуск приложения локально

```

npm start-local
```

В браузере открыть [http://localhost:3000/](http://localhost:3000/)

## Структура проекта:

```
node_modules/                    --> пакеты, установленные через npm
public/                          --> клиент на AngularJS
  auth/                          --> компонент аутентификации/регистрации
    AuthComponent.html           --> файл представления
    AuthComponent.js             --> файл контроллера
    AuthService.js               --> файл сервиса
  client/                        --> компонент клиента
    ClientComponent.html         --> файл представления
    ClientComponent.js           --> файл контроллера
    ClientService.js             --> файл сервиса
  kitchen/                       --> компонент кухни (для повара)
    KitchenComponent.html        --> файл представления
    KitchenComponent.js          --> файл контроллера
    KitchenService.js            --> файл сервиса
  mainMenu/                      --> компонент главного меню
    MainMenuComponent.html       --> файл представления
    MainMenuComponent.js         --> файл контроллера
  app.js                         --> главный angular-модуль
  index.html                     --> главная страница приложения
  styles.css                     --> дополнительные стили приложения
server/                          --> файлы сервера приложения
  db/                            --> папка с моделями БД
    clientModel                  --> модель коллекции клиентов
    orderModel                   --> модель коллекции заказов
  index.js                       --> сервер на Node.js / Express.js / mongoose
  serverConfig.js                --> настройки сервера
  menu.json                      --> данные из меню для кафе
test/                            --> папка с тестами
  client/                        --> клиентские тесты
    e2e/                         --> тесты пользовательского уровня
      clientPage.spec.js         --> тесты страницы пользователя
  server/                        --> серверные тесты
    server.spec.js               --> тесты сервера (mocha / chai)
.gitignore                       --> файл настроек для git
package.json                     --> файл конфигурации для npm
README.md                        --> файл с описанием проекта
```