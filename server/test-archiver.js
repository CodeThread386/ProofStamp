async function test() {
  try {
    const archiver = await import('archiver');
    console.log(Object.keys(archiver));
  } catch (e) {
    console.error(e);
  }
}
test();
