var database = require('./database');

// INSERT
var dados = [
    {
        nome: "Call of duty 2",
        preco: 60.00
    },
    {
        nome: "GTA",
        preco: 60.00
    },
    {
        nome: "WoW",
        preco: 120.00
    },
]

database.insert(dados).into("games").then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});


//  SELECT
database.select().table("games").then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});


// NESTED QUERIES
database.insert({nome: "Mists of noyah", preco: 25}).into("games").then(data => {
    database.select().table("games").then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
}).catch(err => {
    console.log(err);
});


// WHERE
database.select()
    .whereRaw("nome = 'Mists of noyah' OR preco > 60")
    .table("games").then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });


// RAW
database.raw("SELECT * FROM games").then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});


// DELETE
database.where({id: 3}).delete().table("games").then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});


// UPDATE
database.where({id: 5}).update({preco: 40}).table("games").then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});


// ORDER (DESC OR ASC)
database.select().table("games").orderBy("preco", "asc").then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});


// ASSOCIATED INSERTS
database.insert({
    nome: "Blizzard",
    game_id: 5
}).table("estudios").then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});


// INNER JOIN 1 P 1
database.select(["games.*", "estudios.nome as estudio_nome"]).table("games").innerJoin("estudios", "estudios.game_id", "games.id").then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});


// INNER JOIN 1 P M
database.select(["games.*", "estudios.nome as estudio_nome"]).table("games").innerJoin("estudios", "estudios.game_id", "games.id").then(data => {
    var estudiosGamesArray = data;
    var game = {
        id: 0,
        nome: "",
        estudios: []
    }

    game.id = data[0].id;
    game.nome = data[0].nome;

    data.forEach(estudio => {
        game.estudios.push({nome: estudio.estudio_nome});
    });
    console.log(game);
}).catch(err => {
    console.log(err);
});


// INNER JOIN M P M
database.select([
        "estudios.nome as estudio_nome",
        "games.nome as game_nome",
        "games.preco"
    ]).table("games_estudios")
    .innerJoin("games", "games.id", "games_estudios.game_id")
    .innerJoin("estudios", "estudios.id", "games_estudios.estudio_id")
    .where("games.id", 8)
    .then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });


// TRANSACTIONS
async function testeTransacao(){
    try{
        await database.transaction(async trans => {
            await database.insert({nome: "Qualquer nome"}).table("estudios");
            await database.insert({nome: "Pyxeralia"}).table("estudios")
            await database.insert({nome: "Mojang"}).table("estudios")
            await database.insert({nome: "Gearbox"}).table("estudios")
        });
    }catch(err){
        console.log(err);
    }   
}
testeTransacao();