<script setup lang="ts">
import { ref } from 'vue';
const menuOpen = ref(false);
const contributeOpen = ref(false);
</script>

<template>
    
    <span id="navbar" style="border-bottom: 1.5px solid black;">
        <img id="logo" src="../assets/PNG/Asset 1@4x.png"/>
        <div class="spacer"></div>
        <p class="logo-text">TOTDOG</p>
        <div class="spacer middle"></div>
        <div tabindex="0" class="dropdown">
            <router-link to="/" class="dropbtn">Home</router-link>
        </div>
        <div class="spacer"></div>
        <div tabindex="0" class="dropdown">
            <router-link to="/about" class="dropbtn">About</router-link>
        </div>
        <div class="spacer"></div>
        <div tabindex="0" class="dropdown">
            <div class="dropbtn">Contribute</div>
            <div class="dropdown-content">
                <router-link to="/form" class="droplink">Submit Prompts</router-link>
                <router-link to="/propose-attribute" class="droplink">Propose an Attribute</router-link>
                <router-link to="/propose-attribute" class="droplink">Vote on Attributes</router-link>
            </div>
        </div>
        <div class="spacer"></div>
        <div tabindex="0" class="dropdown">
            <router-link to="/stats" class="dropbtn">Statistics</router-link>
        </div>
        <!-- Hamburger button (mobile only) -->
        <button class="hamburger" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <Teleport to="body">
            <!-- Mobile menu -->
            <div class="mobile-menu" :class="{ open: menuOpen }">
                <router-link to="/" class="mobile-link" @click="menuOpen = false">Home</router-link>
                <router-link to="/about" class="mobile-link" @click="menuOpen = false">About</router-link>
                
                <!-- Contribute with submenu -->
                <div class="mobile-dropdown">
                    <div class="mobile-link" @click="contributeOpen = !contributeOpen">
                        Contribute <span class="arrow" :class="{ rotated: contributeOpen }">▾</span>
                    </div>
                    <div class="mobile-submenu" :class="{ open: contributeOpen }">
                        <router-link to="/form" class="mobile-sublink" @click="menuOpen = false">Submit Prompts</router-link>
                        <router-link to="/propose-attribute" class="mobile-sublink" @click="menuOpen = false">Propose an Attribute</router-link>
                        <router-link to="/propose-attribute" class="mobile-sublink" @click="menuOpen = false">Vote on Attributes</router-link>
                    </div>
                </div>

                <router-link to="/stats" class="mobile-link" @click="menuOpen = false">Statistics</router-link>
            </div>
        </Teleport>
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
        letter-spacing: clamp(0px, calc(2vw - 5px), 20px);
        color: wheat;
    }
    #title {
        display: flex;
        align-items: center;
        min-width: 0;
        flex-shrink: 1;
    }
    #navbar {
        display: flex;
        align-items: center;
        /* no justify-content: space-between */
        padding: 3px clamp(5px, calc(5vw - 10px), 40px);
        background-color: rgba(74, 65, 60, .5);
        backdrop-filter: blur(6px);
    }
    #logo {
        height: 40px;
        align-self: center;
    }
    .spacer {
        flex: 0 1 40px;  /* don't grow, can shrink, 40px base */
        min-width: 0;
    }
    .spacer.middle {
        flex: 1 1 40px;  /* same shrink base as others, but grows to push apart */
        min-width: 0;
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
        flex-shrink: 0;
        font-size: 13px;
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
    .dropdown:focus .dropdown-content{
        display: block;
    }
    .hamburger {
        display: none;
    }
    .mobile-menu {
        display: none;
    }
    @media only screen and (max-width: 480px) {
        .dropdown {
            display: none;
        }
    .hamburger {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 24px;
        height: 18px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        margin-right: 5px;
    }

    .hamburger span {
        display: block;
        height: 2.5px;
        width: 20px;
        background-color: wheat;
        transition: all 0.3s ease;
        transform-origin: center;
    }

    /* Animate to X when open */
    .hamburger.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }

 .mobile-menu {
    display: none;
    position: fixed;
    top: 47px;
    left: 0;
    width: 100%;
    background-color: rgba(74, 65, 60, 0.8);
    backdrop-filter: blur(6px);
    flex-direction: column;
    z-index: 99;
    border-bottom: 1.5px solid black;
}
    .mobile-menu.open {
        display: flex;
    }

    .mobile-link {
        color: wheat;
        padding: 14px 20px;
        text-decoration: none;
        font-size: 14px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        cursor: pointer;
    }

    .mobile-link:hover { color: black; }

    .router-link-exact-active.mobile-link {
        font-weight: 900;
        letter-spacing: .375px;
    }

    .mobile-submenu {
        display: none;
        flex-direction: column;
        background-color: rgba(50, 44, 40, 0.75);
    }

    .mobile-submenu.open {
        display: flex;
    }

    .mobile-sublink {
        color: wheat;
        padding: 12px 36px;
        text-decoration: none;
        font-size: 13px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .mobile-sublink:hover { color: black; }

    .arrow {
        display: inline-block;
        transition: transform 0.2s ease;
    }

    .arrow.rotated { transform: rotate(180deg); }
}
    
</style>