import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faFileAudio, faBookReader, faMusic, faTablet, faBookOpen, faSearchPlus, faNewspaper, faFilm, faCloud, faArchive, faChartArea, faUsers, faCompass, faBraille, faCompactDisc, faVideo, faGlobe, faHeadphones, faGamepad, faImage, faLaptop, faFile } from '@fortawesome/free-solid-svg-icons'

const IconMapper = ({format}) => {
    format = format.toLowerCase();
    var iconn="";
    
    if (format == 'book')
    iconn = faBook;
    else if ( format == 'audiobook'
        || format == 'audio'
        || format == 'restricted e-audio' )
    iconn = faFileAudio;
    else if ( format == 'read-along book' )
        iconn = faBookReader;
    else if ( format == 'score'
        || format == 'music'
        || format == 'sheet music'
        || format == 'mp3'
        || format == 'streaming music' )
    iconn = faMusic;
    else if ( format == 'ebook'
        || format == 'e-book' )
    iconn = faTablet;
    else if ( format == 'academic journal'
        || format == 'periodical'
        || format == 'magazine'
        || format == 'unplublish print'
        || format == 'unrestricted etext'
        || format == 'dyslexia-friendly book' )
    iconn = faBookOpen;
    else if ( format == 'large print' )
    iconn = faSearchPlus;
    else if ( format == 'news' )
    iconn = faNewspaper;
    else if ( format == 'video recording' )
    iconn = faFilm;
    else if ( format == 'electronic resource' )
    iconn = faCloud;
    else if ( format == 'kit/object'
        || format == 'lot' )
    iconn = faArchive;
    else if ( format == 'report' )
    iconn = faChartArea;
    else if ( format == 'conference' )
    iconn = faUsers;
    else if ( format == 'cartographic material'
        || format == 'map - globe' )
    iconn = faCompass;
    else if ( format == 'braille'
        || format == 'restricted e-braille' )
    iconn = faBraille;
    else if ( format == 'dvd'
        || format == 'blu-ray'
        || format == 'cd'
        || format == 'vinyl' )
    iconn = faCompactDisc;
    else if ( format == 'vhs'
        || format == 'streaming video' )
    iconn = faVideo;
    else if ( format == 'online' )
    iconn = faGlobe;
    else if ( format == 'book on cd'
        || format == 'e-audiobook'
        || format == 'book on mp3'
        || format == 'daisy disc'
        || format == 'cassette'
        || format == 'book on cassette'
        || format == 'cnib cassette' )
    iconn = faHeadphones;
    else if ( format == 'video game'
        || format == 'toy - object'
        || format.startsWith('nintendo')
        || format.startsWith('play')
        || format.startsWith('xbox')
        || format.startsWith('wii')
        || format.startsWith('ps')
        || format.startsWith('switch') )
    iconn = faGamepad;
    else if ( format == 'art'
        || format == 'graphic novel' )
    iconn = faImage;
    else if ( format == 'laptop' )
    iconn = faLaptop;
    else {
    iconn = faFile;
    }

    return <FontAwesomeIcon icon={iconn} />;
}

export default IconMapper;