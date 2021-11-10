const fs = require( 'fs' );
const path = require( 'path' );

const oriFolder = path.join(__dirname, "ori");
const targetFolder = `${__dirname  }/../../static/metadata/all_metadata.json`;

const imageIPFSPrefix = 'ipfs://Qmcrjm6EU9dJSdYwCBLmMc4JjV7zHKJ6D7SqpoY7ST4Q2t/';
const animationURLIPFSPrefix = 'ipfs://QmPqnfEuQxHg1EtAMGENdDBjWwLNF22pxiWBcKsQ9mMAMS/';

// Make an async function that gets executed immediately
(async ()=>{
    // Our starting point
    try {
        // Get the files as an array
        const files = await fs.promises.readdir( oriFolder );

        // Loop them all with the new for...of
        files.forEach(file => {
            // Get the full paths
            if (!file.includes('json')) {
                return
            }
            if (file.includes('all_metadata')) {
                return
            }

            const idx = file.split('.')[0]
            const fromPath = path.join( oriFolder, file );
            const toPath = path.join( targetFolder, file );
            
            const imageURL = `${imageIPFSPrefix}${idx}.gif`
            const animationURL = `${animationURLIPFSPrefix}${idx}.mp4`

            console.log(idx, fromPath, toPath)
            console.log(imageURL, animationURL)

            const metadata = JSON.parse(fs.readFileSync(fromPath));
            metadata.image = imageURL
            metadata.animation_url = animationURL

            fs.writeFileSync(toPath, JSON.stringify(metadata));
            console.log( "Moved '%s'->'%s'", fromPath, toPath );
        })
    }
    catch( e ) {
        // Catch anything bad that happens
        console.error( "We've thrown! Whoops!", e );
    }

})();