import db from './index';

class TokensRepository {
  async insertToTable(data: any = null) : Promise<any> {
    return db('tokens').insert(data);
  }

  async findOne(value: string, prop: string) : Promise<any> {
    return db('tokens').select('*').where(prop, value).limit(-1);
  }

  async find(value: string, prop: string) : Promise<any> {
    return db('tokens').select('*').where(prop, value);
  }

  async update(token: string, id: string) : Promise<any> {
      return db('tokens').where('userId', id).update('token', token);
  }
}

export default new TokensRepository();
