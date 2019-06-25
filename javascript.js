function clean() {
    $("#in1").val("");
    $("#in2").val("");
    $("#in3").val("");
}

$(document).ready(reload())

function reload() {
    connect();
    $("#select").empty();
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM flats", [], function (tx, result) {
            for (var i = 0; i < result.rows.length; i++) {
                $("#select").append("<option>" + result.rows.item(i)["id"] + "</option>");
            }
        }, null)
    });
};

function connect() {
    db = openDatabase("flat", "", "Flat list", 200000);
    if (!db) {
        alert("Failed to connect to database.");
    }
}

function add() {
    connect();
    $name = $("#in1").val();
    $number = $("#in2").val();
    $area = $("#in3").val();
    $priv = $('input[name="group1"]:checked').val();
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE flats (id INTEGER PRIMARY KEY, name text, number text, area text, priv text)");
    });
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO flats (name,number,area, priv) VALUES(?,?,?,?)", [$name, $number, $area, $priv], reload());
    });
}

function deleteFromFlats() {
    $id = $("#select option:selected").val();
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM flats where id=?", [$id]);
    });
    location.reload();
}

function show() {
    connect();
    $("#hidden").empty();
    $("#hidden").fadeIn("slow", function () {
        db.transaction(function (tx) {
            var content = "<table border='1'> "
            content += "<tr><th>фИО классного руководителя</th><th>Номер класса</th><th>Кол-во учащихся</th><th>Параллель</th> </tr>"
            tx.executeSql("SELECT * FROM flats ", [], function (tx, result) {
                for (var i = 0; i < result.rows.length; i++) {
                    content += '<tr><td>' + result.rows.item(i)["name"]  + '</td>';
                    content += '<td>' + result.rows.item(i)["number"]  + '</td>';
                    content += '<td>' + result.rows.item(i)["area"]  + '</td>';
                    content += '<td>' + result.rows.item(i)["priv"]  + '</td></tr>';
                }
                content += "</table>";
                $('#hidden').append(content);
            }, null)
        });
    })
}

function minArea() {
    connect();
    $("#hidden2").empty();
    $("#hidden2").fadeIn("slow", function () {
        db.transaction(function (tx) {
            var content = "Минимальное количество учащихся: <br><table border='1'> "
            content += "<tr><th>фИО классного руководителя</th><th>Номер класса</th><th>Кол-во учащихся</th><th>Параллель</th> </tr>"
            tx.executeSql("SELECT * FROM flats order by area ", [], function (tx, result) {
                    content += '<tr><td>' + result.rows.item(0)["name"]  + '</td>';
                    content += '<td>' + result.rows.item(0)["number"]  + '</td>';
                    content += '<td>' + result.rows.item(0)["area"]  + '</td>';
                    content += '<td>' + result.rows.item(0)["priv"]  + '</td></tr>';
                content += "</table>";
                $('#hidden2').append(content);
            }, null)
        });
    })
reload()
}
