const fs = require('fs');
const { flattenRsvp } = require('./sheets');

const cases = [
  {
    name: 'pescado y carne con acentos',
    body: {
      assist: 'yes',
      adultsCount: 2,
      adults: [
        { name: 'José García', mealChoice: 'bacalao', intolerance: 'no', intoleranceDetails: '' },
        { name: 'María José', mealChoice: 'solomillo', intolerance: 'yes', intoleranceDetails: 'Sin gluten • sin nuez' }
      ],
      kidsCount: 2,
      kids: [
        { name: 'Lucía-María', intolerance: 'no', intoleranceDetails: '' },
        { name: 'Álvaro Ñúñez', intolerance: 'yes', intoleranceDetails: 'Sin lactosa / sin huevo' }
      ]
    },
    expectedPersonRows: 4
  },
  {
    name: 'comodín y símbolos',
    body: {
      assist: 'yes',
      adultsCount: 1,
      adults: [
        {
          name: 'Diana O\'Connor',
          mealChoice: 'coordinar-restaurante',
          intolerance: 'yes',
          intoleranceDetails: 'Sin soja, sin trigo & sin leche'
        }
      ],
      kidsCount: 1,
      kids: [
        { name: 'Sebastián “Basti”', intolerance: 'yes', intoleranceDetails: 'Sin frutos secos / sin pescado' }
      ]
    },
    expectedPersonRows: 2
  },
  {
    name: 'muchas personas con guiones y tildes',
    body: {
      assist: 'yes',
      adultsCount: 3,
      adults: [
        { name: 'Ana-María López', mealChoice: 'bacalao', intolerance: 'no', intoleranceDetails: '' },
        { name: 'Raúl Álvarez', mealChoice: 'solomillo', intolerance: 'yes', intoleranceDetails: 'Sin cebolla - sin ajo' },
        { name: 'Carmen de la Cruz', mealChoice: 'coordinar-restaurante', intolerance: 'no', intoleranceDetails: '' }
      ],
      kidsCount: 3,
      kids: [
        { name: 'Nora-Patricia', intolerance: 'no', intoleranceDetails: '' },
        { name: 'Jordi & Paula', intolerance: 'yes', intoleranceDetails: 'Sin huevo, sin maní' },
        { name: 'Érika Álvarez', intolerance: 'no', intoleranceDetails: '' }
      ]
    },
    expectedPersonRows: 6
  }
];

async function run() {
  fs.writeFileSync('data/rsvp.json', '[]', 'utf8');
  let expectedTotalRows = 0;

  for (const test of cases) {
    const response = await fetch('http://localhost:3000/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(test.body)
    });

    const data = await response.json();
    console.log('CASE:', test.name, 'STATUS:', response.status, 'OK:', data.ok);

    if (!response.ok) {
      console.log('ERROR_MESSAGE:', data.message || 'sin mensaje');
      process.exit(1);
    }

    const personRows = flattenRsvp(data.entry);
    expectedTotalRows += test.expectedPersonRows;
    console.log('ROWS_FROM_ENTRY:', personRows.length, 'EXPECTED:', test.expectedPersonRows);

    if (personRows.length !== test.expectedPersonRows) {
      console.log('ROW_COUNT_ERROR in', test.name);
      process.exit(1);
    }

    const mealLabels = personRows
      .map((row) => row[5])
      .filter(Boolean)
      .join(' | ');
    console.log('MEALS_IN_ROWS:', mealLabels);
  }

  const records = JSON.parse(fs.readFileSync('data/rsvp.json', 'utf8'));
  const allFlattenedRows = records.flatMap((entry) => flattenRsvp(entry));

  console.log('TOTAL_REGISTROS:', records.length);
  console.log('TOTAL_FILAS_PERSONAS:', allFlattenedRows.length, 'EXPECTED:', expectedTotalRows);
  console.log('ULTIMO_REGISTRO:', JSON.stringify(records[records.length - 1], null, 2));

  if (allFlattenedRows.length !== expectedTotalRows) {
    console.log('TOTAL_ROWS_MISMATCH');
    process.exit(1);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
