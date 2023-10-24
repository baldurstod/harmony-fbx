// I'm not sure there is reserved ids, let's start big
let uniqueId = 1000000n;

export function getUniqueId() {
	return ++uniqueId;
}
