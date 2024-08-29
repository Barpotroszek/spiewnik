const registerSW = async () => {
    if('serviceWorker' in navigator){
        try {
            const registration = await navigator.serviceWorker.register('sw.js', {scope: '/'})
            if(registration.installing)
                console.debug('[SW] Installing...')
            else if(registration.waiting)
                console.debug("[SW] Installed ✅")
            else if(registration.active)
                console.debug("[SW] Active 🥰")
        } catch (error) {
        console.error('[SW] ❌ Error', error)   
        }
    }
}

registerSW()