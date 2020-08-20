import fs from "fs";

export async function recursiveReadDir(
	dirPath: string,
	filter = `^((?!spec).)*.ts`
): Promise<string[]> {
	const regex = new RegExp(filter, `gm`);
	const resultFiles: string[] = [];
	fs.readdirSync(dirPath).forEach((fname: string) => {
		const filePath = `${dirPath}/${fname}`;
		if (fs.statSync(filePath).isDirectory()) {
			recursiveReadDir(filePath).then((success: string[]) => {
				success.forEach(file => {
					resultFiles.push(file);
				});
			});
		} else if (regex.test(fname)) resultFiles.push(filePath);
	});
	return resultFiles;
}
