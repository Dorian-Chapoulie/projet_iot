const {MongoClient} = require('mongodb');
let dbo;
const mongoName = "rssi-wifi-data"

const init = () => {
    const mongoUri = "mongodb+srv://Marais:MaraisJupiter@marais.dvzri.mongodb.net/rssi-wifi-data?retryWrites=true&w=majority";

    const mg_client = new MongoClient(
        mongoUri,
		{
            useNewUrlParser:true, 
            useUnifiedTopology:true,
        },
    );

    mg_client.connect(function(err,  mg_client){
	    if(err) throw err;
        dbo = mg_client.db(mongoName);
    });
};

const addData = (data) => {
    console.log('adding: ', data)
    dbo.collection(mongoName).insertOne({ ...data, date: Date.now() }, (err, res) => {
        if (err) throw err;
    });
}

const getData = async () => {
    return dbo.collection(mongoName).find({}).toArray();
}


module.exports.init = init;
module.exports.addData = addData;
module.exports.getData = getData;