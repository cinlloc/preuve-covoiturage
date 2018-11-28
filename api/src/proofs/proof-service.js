const _ = require('lodash');
const { Schema } = require('mongoose');
const { CsvConverter } = require('@pdc/proof-helpers');
const config = require('@pdc/config');
const eventBus = require('../events/bus');
const aomService = require('../aom/aom-service');
const Proof = require('./proof-model');

const proofService = {
  find(query = {}) {
    return Proof.find(query);
  },

  async update(id, data) {
    const proof = await Proof.findByIdAndUpdate(id, data, { new: true });

    eventBus.emit('proof.update', proof);

    return proof;
  },

  async create(data) {
    const proof = new Proof(data);
    await proof.save();

    eventBus.emit('proof.create', proof);

    return proof;
  },

  async delete(id) {
    eventBus.emit('proof.delete', id);

    return Proof.findByIdAndUpdate(id, { deletedAt: Date.now() });
  },

  async convert(docs, format = 'csv') {
    // convert to an array based on configuration file
    let arr = [];
    const proofs = docs.map((proof) => {
      arr = [];
      config.proofsCsv.headers.forEach((cfg) => {
        arr.push(_.get(proof, cfg.path, ''));
      });

      return arr;
    });

    // output in required format
    switch (format) {
      case 'csv':
        return (new CsvConverter(proofs, config.proofsCsv)).convert();

      default:
        throw new Error('Unsupported format');
    }
  },

  /**
   * Enrich a proof with additional data
   *
   * @param userProof
   * @returns {Promise<*>}
   */
  async enrich(userProof) {
    const proof = (await this.getProof(userProof)).toJSON();

    // the list of all touched AOM during the journey
    // journey_span for each AOM is a percentage of the journey
    // which is done in each AOM
    const queries = [
      proof.start,
      proof.end,
    ].reduce((p, c) => {
      const query = {};
      if (_.has(c, 'lat')) query.lat = c.lat;
      if (_.has(c, 'lng')) query.lng = c.lng;
      if (_.has(c, 'insee')) query.insee = c.insee;
      if (Object.keys(query).length) p.push(query);

      return p;
    }, []);

    const aomList = (await Promise.all(queries.map(aomService.search)))
      .map(i => i.toJSON())
      .map(i => _.assign(i, {
        id: `${i._id}`,
        journey_span: 100, // TODO
      }));

    return Proof.findByIdAndUpdate(proof._id, { aom: _.uniqBy(aomList, 'id') }, { new: true });
  },

  /**
   * get the Proof object from database
   *
   * @param proof
   * @returns {Promise<*>}
   */
  async getProof(proof) {
    if (proof instanceof Proof) {
      return proof;
    }

    if (proof instanceof Schema.Types.ObjectId || _.isString(proof)) {
      return Proof.findOne({ _id: proof });
    }

    throw new Error('Unsupported Proof format, please pass a Proof object or a _id as String');
  },

};

module.exports = proofService;
