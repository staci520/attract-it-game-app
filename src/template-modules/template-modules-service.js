const TemplateModuleService = {
  getTemplateModules(db) {
    return db
      .from('template-module')
      .select(
        'template-module.id',
        'template-module.title',
        'template-module.completed',
      )
  },
  getTemplateModuleById(db, template-module_id) {
    return db
      .from('template-module')
      .select(
        'template-module.id',
        'template-module.title',
        'template-module.completed',
      )
      .where('template-module.id', template-module_id)
      .first()
  },
  insertTemplateModule(db, newTemplateModule) {
    return db
      .insert(newTemplateModule)
      .into('template-module')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteTemplateModule(db, template-module_id) {
    return db('template-module')
      .where({'id': template-module_id})
      .delete()
  },
  updateTemplateModule(db, template-module_id, newTemplateModule) {
    return db('template-module')
      .where({id: template-module_id})
      .update(newTemplateModule, returning=true)
      .returning('*')
  }

}

module.exports = TemplateModuleService