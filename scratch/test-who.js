async function test() {
  const url = "https://ghoapi.azureedge.net/api/WHOSIS_000001?$filter=SpatialDimType eq 'COUNTRY' and SpatialDim eq 'IND'";
  console.log('Fetching:', url);
  const res = await fetch(url);
  const data = await res.json();
  console.log('Total returned:', data.value.length);
  console.log('Sample:', data.value.slice(0, 3));
}
test().catch(console.error);
