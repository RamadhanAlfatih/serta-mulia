const { Firestore } = require('@google-cloud/firestore');
const projectId = 'projek-zahrina'; // Gantilah dengan Project ID Anda

async function storeData(id, data) {
    const db = new Firestore({ projectId });
    const predictCollection = db.collection('prediction');
    try {
        await predictCollection.doc(id).set(data);
        console.log(`Data berhasil disimpan dengan ID: ${id}`);
    } catch (error) {
        console.error('Kesalahan menyimpan data ke Firestore:', error);
        throw error;
    }
}

module.exports = storeData;
