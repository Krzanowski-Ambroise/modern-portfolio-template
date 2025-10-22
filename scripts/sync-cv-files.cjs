const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'portfolio',
  password: 'q8a6dEpWMu',
  port: 5432,
})

async function syncCVFiles() {
  try {
    console.log('🔄 Synchronisation des fichiers CV...')
    
    // Vérifier si le dossier public/cv existe
    const cvDir = path.join(process.cwd(), 'public', 'cv')
    if (!fs.existsSync(cvDir)) {
      console.log('❌ Le dossier public/cv n\'existe pas')
      return
    }

    // Lire tous les fichiers dans public/cv
    const files = fs.readdirSync(cvDir)
    console.log(`📁 Fichiers trouvés dans public/cv: ${files.length}`)
    
    for (const filename of files) {
      const filePath = path.join(cvDir, filename)
      const stats = fs.statSync(filePath)
      
      if (stats.isFile()) {
        console.log(`📄 Traitement du fichier: ${filename}`)
        
        // Vérifier si le fichier existe déjà dans la base
        const existingFile = await pool.query(
          'SELECT id FROM cv_files WHERE filename = $1',
          [filename]
        )
        
        if (existingFile.rows.length === 0) {
          // Extraire le nom original (sans l'extension et le timestamp)
          const nameWithoutExt = path.parse(filename).name
          const originalName = nameWithoutExt.replace(/^cv_\d+_/, '') + path.extname(filename)
          
          // Insérer le fichier dans la base
          await pool.query(`
            INSERT INTO cv_files (original_name, filename, file_path, file_size, upload_date, is_current)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [
            originalName,
            filename,
            `/cv/${filename}`,
            stats.size,
            stats.mtime,
            false // Par défaut, aucun CV n'est actuel
          ])
          
          console.log(`✅ Fichier ajouté: ${originalName}`)
        } else {
          console.log(`⏭️  Fichier déjà existant: ${filename}`)
        }
      }
    }
    
    // Vérifier le nombre total de CV
    const totalCVs = await pool.query('SELECT COUNT(*) FROM cv_files')
    console.log(`📊 Total des CV en base: ${totalCVs.rows[0].count}`)
    
    // Lister tous les CV
    const allCVs = await pool.query('SELECT * FROM cv_files ORDER BY upload_date DESC')
    console.log('\n📋 Liste des CV:')
    allCVs.rows.forEach((cv, index) => {
      console.log(`${index + 1}. ${cv.original_name} (${cv.filename}) - ${cv.is_current ? 'ACTUEL' : 'Ancien'}`)
    })
    
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error)
  } finally {
    await pool.end()
  }
}

syncCVFiles()



