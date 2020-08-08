const TemplateModuleService = {
  getTemplateModules(db) {
    return db
      .from('template_modules')
      .select('*')
      .orderBy('sort_order', 'asc')
  },
  getTemplateModuleById(db, templateModule_id) {
    return db
      .from('template_modules')
      .select('*')
      .where('template-module.id', templateModule_id)
      .first()
  },
  insertTemplateModule(db, newTemplateModule) {
    return db
      .insert(newTemplateModule)
      .into('template_modules')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteTemplateModule(db, templateModule_id) {
    return db('template_modules')
      .where({'id': templateModule_id})
      .delete()
  },
  updateTemplateModule(db, templateModule_id, newTemplateModule) {
    return db('template_modules')
      .where({id: templateModule_id})
      .update(newTemplateModule, returning=true)
      .returning('*')
  }

}

module.exports = TemplateModuleService