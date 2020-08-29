/* Writer.java
 *
 * Class that contains a string list to be written in a log file.
 *
 * @author: James M. Bayon-on
 * @version: 1.3
 */



class Writer {
	private list : string[] = [];
	
	/* Instantiates the writer class.
	 *
	 */
	public constructor() {
        this.list = [];
        console.log("constructed writer %o", this.list)
	}

	/* Accepts a string to add to the string list in the writer class.
	 *
	 * @param: a line string to write into the log
	 */
	public addString(line: string) {
		this.list.push(line);
	}
	
	/* Accepts a Honey and converts the content solution into strings then adds it to the string list.
	 *
	 * @param: a Honey to write into the log
	 */
	/* public addObject(h: Honey) {
		let n = h.getMaxLength();
	    //var board: Board = new Board();

		//this.clearBoard(board, n);

		for(var x = 0; x < n; x++) {
            //board[x][h.getNectar(x)] = "Q";
            board.set(x, h.getNectar(x), "Q")
		} 

		//this.printBoard(board, n);
	}*/
	
	/* Clears a 2D string board with empty string.
	 *
	 * @param: a 2D string board
	 * @param: length of n
	 */
	/* public clearBoard(board: Board, n: number) {
		// Clear the board.
		for(var x = 0; x < n; x++) {
			for(var y = 0; y < n; y++) {
                //board[x][y] = "";
                board.set(x,y,"")
			}
		}
	} */
	
	/* Replaces the position of the queens with Q in the string board and a dot for indexes with no queens.
	 *
	 * @param: a 2D string board
	 * @param: length of n
	 */
	/* public printBoard(board: Board, n: number) {
		// Display the board.
		for(var y = 0; y < n; y++) {
			var temp = "";
			for(var x = 0; x < n; x++) {
				if( board.get(x,y) == "Q") {
					temp += "Q ";
				} else {
					temp += ". ";
				}
			}
			board.push([temp]);
		}
	} */
	
	/* Writes the string list into a log file.
	 *
	 * @param: a string filename
	 */
	public writeFile(filename: string) {
		/* try{
        	FileWriter fw = new FileWriter(filename);
			BufferedWriter bw = new BufferedWriter(fw);
		
			for(int i = 0; i < list.size(); i++) {
				bw.write(list.get(i));
				bw.newLine();
				bw.flush();
			}

			bw.close();
        } catch (IOException e) {
        	System.out.println("Writing failed");
        } */
        /* for(var i = 0; i < list.size(); i++) {
            bw.write(list.get(i));
            bw.newLine();
            bw.flush();
        } */
        console.log("start print ===>")
        this.list.forEach((value) => {
            console.log(value)
        })
        console.log("end print ===>")
	}
}