// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { useRouter } from 'next/router'


function hexToLat (input) {
  let result = "";
  if (parseInt(input[0], 16) < 15) {
    result = result + "+";
  } else {
    result = result + "+";
  }
  result = result + Math.floor(parseInt(input.slice(1,4), 16)*90/4095) + "." + parseInt(input.slice(4,10), 16)
  return result;
}

function hexToLong (input) {
  let result = "";
  if (parseInt(input[0], 16) < 15) {
    result = result + "+";
  } else {
    result = result + "+";
  }
  result = result + Math.floor(parseInt(input.slice(1,4), 16)*180/4095) + "." + parseInt(input.slice(4,10), 16);
  return result;
}

export default function handler(req, res) {

  const id = req.query.id;
  if ( id == 'contract.json') {
      const contract = {
          "name": "The Orthoverse Land Collection",
          "description": "The Orthoverse is the largest NFT collection in existence, with over 1.4 quindecillion tokens in existence. Every Ethereum address already has an NFT representing a parcel of land in the Orthoverse. Visit our site to reveal your NFT and to learn more about the project.",
          "image": "https://orthoverse.io/logo.png",
          "external_link": "https://orthoverse.io/",
          "seller_fee_basis_points": 250,
          "fee_recipient": "0x2Ccc96B3690F88F05b1B99319c4eCfce033Dddd5"
        }
      res.status(200).json(contract)
  } else {
    //https://orthoverse.io/api/metadata/0x38106f0c4af7aad085e7948def430581243654ce-1.json

    let shortId = id.match(/0x(.*)-/).pop();  // remove -X.json postfix and 0x prefix
    const castle = id.match(/-(.*)\./).pop();
    console.log("Castle: " + castle);
    let realm = "Fantasy";
    if ( parseInt(castle) > 7) { realm = "Futuristic"};
    console.log("Realm: " + realm);

    if ((shortId.length > 40) || (parseInt(castle) > 15)) {
      // address of token cannot be more than 40 characters
      // and castle cannot be bigger than 15
      res.status(404).send('Error 404');
    } else {
      shortId =  shortId.padStart(40, '0'); // pad to 40 characters
      const Lat = hexToLat(shortId.slice(-20));
      const Long = hexToLong(shortId.slice(0, 20));
      const metadata = {
        "attributes": [
          {
              "trait_type": "Latitude",
              "value": Lat,
          },
          {
              "trait_type": "Longitude",
              "value": Long,
          },
          {
              "trait_type": "Realm",
              "value": realm,
          }
        ],
        "external_url": "https://orthoverse.io/",
        "name": "0x" + shortId.slice(-40),
        "description": "Orthoverse Land for 0x" + shortId,
        "image": "https://orthoverse.io/api/img/" + shortId + "-" + castle + ".png",
        }
      res.status(200).json(metadata)
    }

  }
}
