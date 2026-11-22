---
title: Secure Immich Server
category: projects
aliases: immich, wireguard, luks, self-hosted, homelab, photo cloud, vpn, ufw, nginx, privacy, securityimmichserver
action: open:immich
---

## Overview

**Secure Immich Server** is a self-hosted personal photo cloud built on Immich with a strict zero-public-exposure design. Running on a repurposed 2019 gaming laptop with Ubuntu LTS, it gives me cloud-style photo management (facial detection, smart search, mobile backups) while keeping complete data sovereignty and zero third-party cloud dependence.

- **GitHub:** https://github.com/HiSiddharth/SecureImmichServer
- **Medium Write-up:** https://medium.com/@hisiddharth/building-a-private-photo-cloud-security-first-design-for-self-hosted-immich-163838838e65

## Why I Built It

Rising cloud subscription fees, privacy concerns over personal media, and the friction of managing manual encrypted hard-drive backups led me to build a centralized, private system I control operationally and technically—avoiding duplicate files, accidental losses, and clunky backup workflows.

## Architecture & Security Hardening

- **Zero Public Exposure & VPN-Only Access:** WireGuard (on a non-standard port with manual peer management and periodic key rotation) is the only exposed service; SSH and web access require VPN authentication.
- **Defense-in-Depth Network & Reverse Proxy:** Nginx listens only on the WireGuard interface and proxies to Immich bound to `127.0.0.1` over self-signed TLS, while Immich runs via Docker Compose on a bridge network (`immich_default`) with no host networking.
- **Hostile-by-Default Firewall:** UFW defaults to deny across inbound, outbound, and routed traffic, allowing only WireGuard, SSH over WireGuard, and necessary container egress.
- **LUKS Encryption at Rest & Lifecycle Scripts:** Photo storage sits on a LUKS-encrypted partition unlocked manually on startup and checked against active Immich jobs before graceful shutdown, unmounting, and re-locking—keeping encryption keys out of persistent disk storage.
- **Hardware UPS & Monitoring:** Kept plugged in with charge capped at 60%, monitored every 5 minutes via cron to trigger a safe shutdown if discharging below 30%, paired with deliberate manual updates to reduce supply-chain risk.
