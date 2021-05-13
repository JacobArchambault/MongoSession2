const jokes = [];
	jokes.push("What is orange and sounds like a parrot? A carrot.")
	jokes.push("What is the Australian word for a boomerang that will not come back? A stick.")
	jokes.push("Arnold Swartzeneger and Sylvester Stallone are making a movie about the lives of the great composers. Stallone says 'I want to be Mozart.' Swartzeneger says: 'In that case... I'll be Bach.' ")

module.exports = function() {
	
	const index = Math.floor(Math.random() * 3);   // random integer between 0 and 2
	
	return jokes[index];  // return 1 joke
};


