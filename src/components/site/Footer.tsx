import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail } from "lucide-react";
import logoUrl from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-navy-deep text-silver/70 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gradient-to-br from-mid-blue to-indigo-steel font-display text-lg font-bold text-white">
                景
              </div>
              <div>
                <div className="font-display text-lg font-bold text-white">东莞市景鸿科技有限公司</div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-silver/60">
                  DONGGUAN JINGHONG TECHNOLOGY CO., LTD.
                </div>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed">
              专注于精密线圈和微型直线电机制造，融合精益生产理念与自动化技术，
              为全球知名手机厂家提供优质线圈制造服务。
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">导航</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">首页</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">产品中心</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">关于我们</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">联系我们</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">联系方式</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-mid-blue" />
                <span>广东省东莞市凤岗镇</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 shrink-0 text-mid-blue" />
                <span>请联系我们获取</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 shrink-0 text-mid-blue" />
                <span>请联系我们获取</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-silver/50 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} 东莞市景鸿科技有限公司 版权所有</span>
          <span>精密制造 · 智造未来</span>
        </div>
      </div>
    </footer>
  );
}