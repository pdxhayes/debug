<?php if ($tooltip == ""):?>
<a target="_blank" href="<?php print $link;?>" class="social-icon <?php print $class;?>"><span><i class="<?php print $icon;?>"></i></span> <?php print $content;?></a>
<?php else: ?>
<a target="_blank" data-placement="auto" data-toggle="tooltip" title="<?php print $tooltip;?>" href="<?php print $link;?>" class="dtooltip social-icon <?php print $class;?>"><span><i class="<?php print $icon;?>"></i></span> <?php print $content;?></a>
<?php endif;?>
    
