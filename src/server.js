const express = require("express")
const server = express()

//Pegar o banco de dados
const db = require("./database/db.js")

//Configurar pasta public
server.use(express.static("public"))

//Habilitar o uso do red.body na aplicação
server.use(express.urlencoded({ extended: true }))


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
   //req.query: Query Strings da URL
  // console.log(req.query)
   
   return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
   
   //req.body: O corpo do nosso formulário
   //console.log(req.body)

   //Inserir dados no banco de dados
   //2 Inserir dados na tabela
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `    
    const values = [
      req.body.image,
      req.body.name,
      req.body.address,
      req.body.address2,
      req.body.state,
      req.body.city,
      req.body.items
    ]        
    
    function afterInsertData(err){
        if(err){
             console.log(err)
             return res.send("Erro no Cadastro")
        }

        console.log("Cadastrado com Sucesso")
        console.log(this)
        return res.render("create-point.html", {saved: true})
    }
    
    db.run (query, values, afterInsertData)

})

server.get("/search", (req, res) => {

   const search = req.query.search

   if(search == ""){
      //Pesquisa vazia
      return res.render("search-results.html", { total: 0})
   }



   //pegar os dados do banco de dados
   db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
         if(err){
            return console.log(err)
         }
         const total = rows.length
         // Mostrar a página HTML com os dados do banco de dados
         return res.render("search-results.html", { places: rows, total: total})
   })

    
 })
// Ligar o servidor
server.listen(3000)