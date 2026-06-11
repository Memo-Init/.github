import fs from 'node:fs'
import path from 'node:path'


// Source of truth: the published `spec` repo's resolved refs. Resolution order so it
// works both locally and in CI:
//   1. SPEC_REPO_DIR env (CI checks out the spec repo and points here), else local sibling ../spec
//   2. if <dir>/generated/refs.resolved.json exists on disk -> read it
//   3. otherwise -> fetch the published raw URL
const SPEC_REPO_DIR = process.env.SPEC_REPO_DIR || path.resolve( '../spec' )
const LOCAL_REFS_PATH = path.resolve( SPEC_REPO_DIR, 'generated/refs.resolved.json' )
const REMOTE_REFS_URL = 'https://raw.githubusercontent.com/Memo-Init/spec/main/generated/refs.resolved.json'
const OUT_PATH = path.resolve( 'src/data/refs.json' )
const EXPECTED_SCHEMA = 'refs/1.0.0'

const loadRefs = async () => {
    if( fs.existsSync( LOCAL_REFS_PATH ) ) {
        return { refs: JSON.parse( fs.readFileSync( LOCAL_REFS_PATH, 'utf-8' ) ), source: LOCAL_REFS_PATH }
    }
    const response = await fetch( REMOTE_REFS_URL )
    if( !response.ok ) {
        console.error( `[fetch-refs] remote fetch failed (${ response.status }) at ${ REMOTE_REFS_URL }` )
        process.exit( 1 )
    }
    return { refs: await response.json(), source: REMOTE_REFS_URL }
}

const { refs, source } = await loadRefs()

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
console.log( `[fetch-refs] source=${ source }` )
