
function game(id){
    document.getElementById('imgx').src="white.png";
    var ID = id;
    var AIchoice = "";
    var r = Math.floor(Math.random() * 100);
    /* 0 = rock, 1 = paper, 2 = scissors
     */
    if (r < 33) {
        AIchoice = 'rock';
    }
    else if (r < 66) {
        AIchoice = 'paper';
    }
    else {
        /* scissors */
        AIchoice = 'scissors';
    }
    if (ID == AIchoice) {
        if (AIchoice == "rock"){
            document.getElementById('imgx').src="rock.png";
        }
        else if (AIchoice =="paper"){
            document.getElementById('imgx').src="paper.jpg";
        }
        else
        {
            document.getElementById('imgx').src="scissors.jpg";
        }
        document.getElementById('output').innerHTML = 'Output: Its a draw!';
    }
    else if (ID == 'rock')
    {
        if (AIchoice == 'paper'){
            document.getElementById('imgx').src="paper.jpg";
            document.getElementById('output').innerHTML = 'Output: You lose!';
        }
        else
        {
            document.getElementById('imgx').src="scissors.jpg";
            document.getElementById('output').innerHTML='Output: You win!';
        }
    }
    else if (ID == "paper"){
        if (AIchoice == 'scissors'){
            document.getElementById('imgx').src="scissors.jpg";
            document.getElementById('output').innerHTML='Output: You lose!';
        }
        else
        {
            document.getElementById('imgx').src="rock.png";
            document.getElementById('output').innerHTML='Output: You win!';
        }
    }
    else
        /*scissors*/
    {
        if (AIchoice == 'rock'){
            document.getElementById('imgx').src="rock.png";
            document.getElementById('output').innerHTML='Output: You lose!';
        }
        else
        {
            document.getElementById('imgx').src="paper.jpg";
            document.getElementById('output').innerHTML='Output: You win!';
        }
    }
}