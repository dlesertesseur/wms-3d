import PartsService from "../services/parts.service";

async function getAll(req, res) {
  try {
    const service = new PartsService();
    const ret = await service.getAll();
    res.send(ret);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function findById(req, res) {
  const id = req.params.id;
  try {
    const service = new PartsService();
    const ret = await service.findById(id);
    res.send(ret);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function insert(req, res) {
  const body = req.body;
  try {
    const service = new PartsService();
    const ret = await service.insert(body);
    res.send(ret);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function update(req, res) {
  const id = req.params.id;
  const body = req.body;
  try {
    const service = new PartsService();
    const ret = await service.update(id, body);
    res.send(ret);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function remove(req, res) {
  const id = req.params.id;
  try {
    const service = new PartsService();
    const ret = await service.remove(id);
    res.send(ret);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

export {getAll, findById, insert, update, remove}