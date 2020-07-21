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
  getTemplateModuleById(db, templateModule_id) {
    return db
      .from('template-module')
      .select(
        'template-module.id',
        'template-module.title',
        'template-module.completed',
      )
      .where('template-module.id', templateModule_id)
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
  deleteTemplateModule(db, templateModule_id) {
    return db('template-module')
      .where({'id': templateModule_id})
      .delete()
  },
  updateTemplateModule(db, templateModule_id, newTemplateModule) {
    return db('template-module')
      .where({id: templateModule_id})
      .update(newTemplateModule, returning=true)
      .returning('*')
  }

}

module.exports = TemplateModuleService