<script>
let lastScroll = 0;
const mainNavbar = document.getElementById('main-navbar');
const expandedNavbar = document.getElementById('expanded-navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll < lastScroll && currentScroll > 50) {
        // Scrolling up
        mainNavbar.style.display = "none";
        expandedNavbar.style.display = "block";
    } else {
        // Scrolling down or at the top
        mainNavbar.style.display = "block";
        expandedNavbar.style.display = "none";
    }
    lastScroll = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
});
</script>