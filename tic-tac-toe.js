grid = document.querySelector('main');
grid.addEventListener('click', showHideWinLine);

winLine = document.querySelector('.win-line');
function showHideWinLine() {
    winLine.classList.toggle('visible');
}

moveWinLine('[1, 9]');
function moveWinLine(coordinates) {
    switch (coordinates) {
        case '[1, 9]': // diagonal
            lineTransform = 'rotate(45deg) translate(-148px, -148px)';
            break;
        case '[4, 6]': // middle row
            lineTransform = 'translateY(-210px)';
            break;
        case '[1, 3]': // top row
            lineTransform = 'translateY(-315px)';
            break;
        case '[7, 9]': // bottom row
            lineTransform = 'translateY(-105px)';
            break;
        case '[3, 7]': // diagonal
            lineTransform = 'rotate(135deg) translate(-148px, 148px)';
            break;
        case '[1, 7]': // first column
            lineTransform = 'translate(-105px, -205px) rotate(90deg)';
            break;
        case '[2, 8]': // second column
            lineTransform = 'translate(0, -205px) rotate(90deg)';
            break;
        case '[3, 9]': // third column
            /* X and Y transform switch if you rotate first*/
            lineTransform = 'rotate(90deg) translate(-205px, -105px)';
            break;
    }
    winLine.style.transform = `${lineTransform}`;

}