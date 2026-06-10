import fs from 'node:fs'
import path from 'node:path'


// LOCAL-ONLY bootstrap: read the resolved refs from the sibling `spec` repo on disk.
// The repos live side by side under projects/memo-init/repos/{spec,.github}, so the
// spec's generated refs are at ../spec/generated/refs.resolved.json relative to repo root.
//
// In CI this script would instead fetch the published raw URL:
//   https://raw.githubusercontent.com/Memo-Init/spec/main/generated/refs.resolved.json
// via `await fetch( REFS_URL )`. For the local bootstrap we read the file directly.
const LOCAL_REFS_PATH = path.resolve( '../spec/generated/refs.resolved.json' )
const OUT_PATH = path.resolve( 'src/data/refs.json' )
const EXPECTED_SCHEMA = 'refs/1.0.0'

if( !fs.existsSync( LOCAL_REFS_PATH ) ) {
    console.error( `[fetch-refs] local spec refs missing at ${ LOCAL_REFS_PATH }` )
    console.error( '[fetch-refs] expected the sibling "spec" repo to have run generate-refs.mjs first' )
    process.exit( 1 )
}

const raw = fs.readFileSync( LOCAL_REFS_PATH, 'utf-8' )
const refs = JSON.parse( raw )

if( refs.schemaVersion !== EXPECTED_SCHEMA ) {
    console.error( `[fetch-refs] schemaVersion mismatch — expected "${ EXPECTED_SCHEMA }", got "${ refs.schemaVersion }"` )
    process.exit( 1 )
}

if( refs.validation?.passed !== true ) {
    console.error( '[fetch-refs] validation.passed is not true — spec refs.resolved.json is invalid' )
    process.exit( 1 )
}

fs.mkdirSync( path.dirname( OUT_PATH ), { recursive: true } )
fs.writeFileSync( OUT_PATH, JSON.stringify( refs, null, 4 ), 'utf-8' )

console.log( `[fetch-refs] OK — spec.currentVersion=${ refs.spec.currentVersion }, generated.at=${ refs.generated.at }` )
console.log( `[fetch-refs] source=${ LOCAL_REFS_PATH }` )
