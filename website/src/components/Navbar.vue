<template>
    
    <span id="navbar" style="border-bottom: 1.5px solid black;">
        <span id="title">
            <img id="logo" src="../assets/PNG/Asset 1@4x.png"/>
            <p class="logo-text">
                TOTDOG
            </p>
        </span>
        <span id="page-links">
            <div class="dropdown">
                <router-link to="/" class="dropbtn">Home</router-link>
            </div>
            <div class="dropdown">
                <div class="dropbtn">Contribute</div>
                <div class="dropdown-content">
                    <router-link to="/form" class="droplink">Submit Prompts</router-link>
                    <router-link to="/propose-attribute" class="droplink">Propse an Attribute</router-link>
                    <router-link to="/propose-attribute" class="droplink">Vote on Attributes</router-link>
                </div>
            </div>
            <div class="dropdown">
                <router-link to="/stats" class="dropbtn">Statistics</router-link>
            </div>
        </span>
    </span>
</template>

<style scoped>
/* Links inside the dropdown */
    .droplink {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
    font-weight: 100;
    }
    .dropdown:has(.router-link-exact-active) {
        /* border-bottom: 2px solid #000000; */
        font-weight: 900;
        letter-spacing: .375px;
    }
    
    .router-link-exact-active {
        /* border-bottom: 2px solid #000000; */
        font-weight: 900;
        letter-spacing: .375px;
    }
    .logo-text {
        font-weight: 750;
        font-size: 30px;
        margin: 0;
        letter-spacing: 10px;
        color: wheat;
    }
    #title {
        display: flex;
        gap: 40px;
        align-items: center;
    }
    #navbar {
        display: flex;
        justify-content: space-between;
        padding: 3px 40px 3px 20px;
        background-color: rgba(74, 65, 60, .5);
    }
    #logo {
        height: 40px;
        align-self: center;
    }
    #page-links {
        display: flex;
        align-items: center;
        gap: 40px;
        font-size: x-small;
    }
    .underlay {
        background-color: black;
        position: absolute;
        height: 100%;
        width: 100%;
    }
    /* Container needed to position the dropdown content */
    .dropdown {
    position: relative;
    display: inline-block;
    }

    /* Style the button */
    .dropbtn {
    border: none;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    }
    .dropbtn:hover {
        color: wheat
    }
    /* Dropdown Content (Hidden by Default) */
    .dropdown-content {
    display: none;
    position: absolute;
    left: -30%;
    background-color: rgb(144, 139, 137);
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    width: 190%;
    }

    /* Change color of dropdown links on hover */
    .dropdown-content a:hover {
    /* background-color: rgba(74, 65, 60, 1); */
    color: wheat;
    }

    /* 🌟 THE CORE HOVER LOGIC 🌟 */
    /* Show the dropdown menu when hovering over the container */
    .dropdown:hover .dropdown-content {
    display: block;
    }

</style>