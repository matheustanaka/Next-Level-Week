const express = require("express")
const server = express()

//Configurar pasta public
server.use(express.static("public"))

//Utilizando o template engie
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true,
})

//Configurar caminhos da aplicação
//Página Inicila (Home)
//req: requisição (pedido)
//res: respostas 
server.get("/", (req, res) => {
   return res.render("index.html", { title:"Um, titulo"})
})

server.get("/create-point", (req, res) => {
   return res.render("create-point.html")
})

server.get("/search", (req, res) => {
    return res.render("search-results.html")
 })
// Ligar o servidor
server.listen(3000)