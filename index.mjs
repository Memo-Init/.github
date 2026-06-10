import fs from 'node:fs'
import path from 'node:path'
import { config } from './src/data/config.mjs'
import { BadgeTable } from './node_modules/badgetable/src/BadgeTable.mjs'
import { replaceRefsPlaceholders } from './src/lib/placeholder-replace.mjs'


const btg = new BadgeTable()

const templatePath = path.resolve( 'src/data/template.txt' )
const refsPath = path.resolve( 'src/data/refs.json' )
const outputPath = path.resolve( 'profile/README.md' )

const template = fs.readFileSync( templatePath, 'utf-8' )

if( !fs.existsSync( refsPath ) ) {
    console.error( `[index] refs.json missing at ${ refsPath } — run "npm run fetch-refs" first` )
    process.exit( 1 )
}

const refs = JSON.parse( fs.readFileSync( refsPath, 'utf-8' ) )

const afterRefs = replaceRefsPlaceholders( { template, refs } )

const afterBadges = config
    .reduce( ( acc, { preset, projects, replace } ) => {
        const badgeTable = btg
            .getTable( { preset, projects } )
            .replace( 'This table is generated using https://github.com/a6b8/badgeTable', '' )
        return acc.replace( replace, badgeTable )
    }, afterRefs )

fs.mkdirSync( path.dirname( outputPath ), { recursive: true } )
fs.writeFileSync( outputPath, afterBadges, 'utf-8' )
console.log( 'README.md updated successfully.' )
