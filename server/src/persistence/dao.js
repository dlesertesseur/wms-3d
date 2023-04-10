class Dao {
  constructor(collection) {
    this.collection = collection
  }

  async getAll(limit) {
    let ret = null;
    try {
      if (limit){
        ret = await this.collection.find().limit(limit).lean();
      }else{
        ret = await this.collection.find().lean();
      }
      return ret;
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      let ret = await this.collection.findById(id).lean();
      return ret;
    } catch (error) {
      throw error;
    }
  }

  async insert(actor) {
    try {
      let ret = await this.collection.create(actor);
      return ret;
    } catch (error) {
      throw error;
    }
  }

  async remove(cid) {
    try {
      let actor = await this.collection.findOne(cid);
      if (actor) {
        actor.parts = [];
        const ret = await this.collection.updateOne(actor);
        return ret;
      } else {
        throw { message: "not found" };
      }
    } catch (error) {
      throw error;
    }
  }
}

export default Dao;
