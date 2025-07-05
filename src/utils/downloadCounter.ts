// Smart download counter utility
export class DownloadCounter {
  private static readonly STORAGE_KEY = 'inrent_download_stats';
  private static readonly SESSION_KEY = 'inrent_session_downloads';

  // Initialize download stats
  private static getStats() {
    try {
      const stats = localStorage.getItem(this.STORAGE_KEY);
      return stats ? JSON.parse(stats) : { totalDownloads: 0, lastUpdated: Date.now() };
    } catch {
      return { totalDownloads: 0, lastUpdated: Date.now() };
    }
  }

  // Get session downloads to prevent multiple counts per session
  private static getSessionDownloads() {
    try {
      const sessionDownloads = sessionStorage.getItem(this.SESSION_KEY);
      return sessionDownloads ? JSON.parse(sessionDownloads) : [];
    } catch {
      return [];
    }
  }

  // Check if download was already counted in this session
  private static wasAlreadyCounted(type: string): boolean {
    const sessionDownloads = this.getSessionDownloads();
    return sessionDownloads.includes(type);
  }

  // Mark download as counted in session
  private static markAsCounted(type: string) {
    const sessionDownloads = this.getSessionDownloads();
    sessionDownloads.push(type);
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionDownloads));
  }

  // Smart download detection - checks if actual download is happening
  public static async trackDownload(type: 'apk' | 'ios' | 'android', downloadUrl: string): Promise<boolean> {
    // Check if already counted in this session
    if (this.wasAlreadyCounted(type)) {
      return false;
    }

    try {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = type === 'apk' ? 'InRent.apk' : '';
      
      // Listen for actual download start
      return new Promise((resolve) => {
        let downloadStarted = false;

        // Monitor for visibility change (common when download starts)
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'hidden' && !downloadStarted) {
            downloadStarted = true;
            this.incrementCounter();
            this.markAsCounted(type);
            resolve(true);
          }
        };

        // Monitor for focus loss (another indicator of download)
        const handleBlur = () => {
          if (!downloadStarted) {
            setTimeout(() => {
              downloadStarted = true;
              this.incrementCounter();
              this.markAsCounted(type);
              resolve(true);
            }, 100);
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup listeners after a short delay
        setTimeout(() => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          window.removeEventListener('blur', handleBlur);
          if (!downloadStarted) {
            resolve(false);
          }
        }, 2000);
      });
    } catch (error) {
      console.error('Download tracking error:', error);
      return false;
    }
  }

  // Increment the download counter
  private static incrementCounter() {
    const stats = this.getStats();
    stats.totalDownloads += 1;
    stats.lastUpdated = Date.now();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
  }

  // Get current download count
  public static getTotalDownloads(): number {
    return this.getStats().totalDownloads;
  }

  // Format download count for display
  public static getFormattedCount(): string {
    const count = this.getTotalDownloads();
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  }
}