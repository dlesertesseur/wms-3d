class Service {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll(limit) {
    const ret = await this.dao.getAll(limit);
    return ret;
  }

  async findById(id) {
    const ret = await this.dao.findById(id);
    return ret;
  }

  async insert(obj) {
    const ret = await this.dao.insert(obj);
    return ret;
  }

  async update(id, body) {
    const ret = await this.dao.update(id, body);
    return ret;
  }

  async remove(id) {
    await this.dao.remove(id);
  }
}

export default Service;
